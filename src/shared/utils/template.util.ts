import config from "@/config";
import fs from "fs";
import handlebars from "handlebars";
import path from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

// Cache for compiled templates
const templateCache = new Map<string, handlebars.TemplateDelegate>();

/**
 * Register Handlebars helpers (optional)
 * Example: Format dates, currency, etc.
 */
handlebars.registerHelper("formatDate", (date: Date) => {
  return date.toLocaleDateString();
});

/**
 * Register partials from a directory (optional)
 */
const registerPartials = async (partialsDir: string) => {
  try {
    const partialFiles = fs.readdirSync(partialsDir);

    await Promise.all(
      partialFiles.map(async (file) => {
        const partialName = path.basename(file, ".hbs");
        const content = await readFile(path.join(partialsDir, file), "utf8");
        handlebars.registerPartial(partialName, content);
      })
    );
  } catch (err) {
    if (config.env !== "test") {
      console.warn("Could not register partials:", err);
    }
  }
};

// Auto-register partials on startup (layouts, common components)
const partialsDir = path.join(
  __dirname,
  "../../modules/shared/services/email/templates/layouts"
);
registerPartials(partialsDir).catch(() => {});

/**
 * Compile email template with caching
 * @param templatePath Relative path from templates directory (e.g., 'auth/reset-password')
 * @param context Data to inject into template
 */
export const compileTemplate = async (
  templatePath: string,
  context: Record<string, unknown>
): Promise<string> => {
  try {
    // Check cache first
    if (templateCache.has(templatePath)) {
      return templateCache.get(templatePath)!(context);
    }

    // Load template file
    const fullPath = path.join(
      __dirname,
      `../../modules/shared/services/email/templates/${templatePath}.hbs`
    );
    const templateContent = await readFile(fullPath, "utf8");

    // Compile and cache
    const template = handlebars.compile(templateContent);
    templateCache.set(templatePath, template);

    return template(context);
  } catch (error) {
    console.error(`Template compilation failed for ${templatePath}:`, error);
    throw new Error(`Could not compile email template: ${templatePath}`);
  }
};

/**
 * Precompile all templates on startup (optional, for production)
 */
export const warmupTemplateCache = async () => {
  if (config.env !== "production") return;

  const templatesDir = path.join(
    __dirname,
    "../../modules/shared/services/email/templates"
  );

  const walkDir = (dir: string): string[] => {
    return fs.readdirSync(dir).reduce((acc: string[], file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        return [...acc, ...walkDir(fullPath)];
      }
      return file.endsWith(".hbs")
        ? [...acc, path.relative(templatesDir, fullPath).replace(/\.hbs$/, "")]
        : acc;
    }, []);
  };

  const templatePaths = walkDir(templatesDir);

  await Promise.all(
    templatePaths.map((tpl) => compileTemplate(tpl, {}).catch(() => {}))
  );
};

// Warm up cache in production
if (config.env === "production") {
  warmupTemplateCache().catch(() => {});
}
