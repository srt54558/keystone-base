import { v } from "convex/values";
import { internalAction, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { sendEmail } from "./utils/email";
import { authComponent } from "./auth";

export const triggerHandoffEmail = action({
  args: { blueprintId: v.id("blueprints") },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) throw new Error("Unauthorized");

    const authId: string = (authUser as any).id || authUser._id;

    // Get the user mirror
    const user = await ctx.runQuery(internal.users.getMeInternal, { authUserId: authId });
    if (!user) throw new Error("User not found");

    // Get the blueprint (use internal query to bypass ownership if needed, or just standard query)
    const blueprint = await ctx.runQuery(internal.blueprints.getByIdInternal, { id: args.blueprintId });
    if (!blueprint || blueprint.userId !== user._id) throw new Error("Unauthorized");

    await ctx.runAction(internal.emails.sendBlueprintReadyEmail, {
      email: user.email,
      userName: user.name,
      blueprintTitle: blueprint.title,
      publicId: blueprint.publicId,
      licenseKey: user.licenseKey,
    });

    return { sent: true };
  },
});

export const sendBlueprintReadyEmail = internalAction({
  args: {
    email: v.string(),
    userName: v.string(),
    blueprintTitle: v.string(),
    publicId: v.string(),
    licenseKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { email, userName, blueprintTitle, publicId, licenseKey } = args;

    const subject = `Keystone Blueprint Ready: ${blueprintTitle}`;

    const html = `
      <!DOCTYPE html>
      <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="x-apple-disable-message-reformatting">
        <meta name="color-scheme" content="dark">
        <meta name="supported-color-schemes" content="dark">
        <style>
          body { font-family: 'Inter', -apple-system, sans-serif; background-color: #000000; color: #fafafa; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
          .wrapper { background-color: #000000; width: 100%; table-layout: fixed; }
          .container { max-width: 600px; margin: 0 auto; background: #09090b; padding: 40px; border: 1px solid #27272a; border-radius: 12px; }
          .header { margin-bottom: 30px; border-bottom: 1px solid #27272a; padding-bottom: 20px; }
          .logo { font-size: 20px; font-weight: bold; color: #ffffff; letter-spacing: -0.05em; }
          .content { font-size: 16px; line-height: 1.6; color: #a1a1aa; }
          .highlight { color: #6366f1; font-weight: 600; }
          .card { background-color: #101010; border: 1px solid #27272a; padding: 24px; border-radius: 8px; margin: 30px 0; }
          .code { font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace; font-size: 14px; color: #e4e4e7; background: #000000; padding: 12px; border-radius: 4px; display: block; margin-top: 10px; border: 1px solid #27272a; }
          .license-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #10b981; font-size: 10px; text-transform: uppercase; font-weight: bold; margin-bottom: 8px; }
          .footer { margin-top: 40px; font-size: 12px; color: #52525b; border-top: 1px solid #27272a; padding-top: 20px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div style="padding: 40px 20px;">
            <div class="container">
              <div class="header">
                <span class="logo">Keystone Protocol</span>
              </div>
              
              <div class="content">
                <p>Hello ${userName},</p>
                
                <p>Your architectural blueprint for <span class="highlight">${blueprintTitle}</span> has been finalized and is ready for materialization.</p>
                
                <p>Run the following command in your terminal to initialize the project locally:</p>
                
                <div class="card">
                  <div style="margin-bottom: 5px; font-size: 11px; text-transform: uppercase; color: #71717a; letter-spacing: 0.05em;">Initialization Command</div>
                  <div class="code">keystone init --id ${publicId}</div>
                </div>

                ${licenseKey ? `
                <div class="card" style="border-color: rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.02);">
                  <div class="license-badge">Pro License Active</div>
                  <div style="margin-bottom: 5px; font-size: 11px; text-transform: uppercase; color: #71717a; letter-spacing: 0.05em;">Your License Key</div>
                  <div class="code" style="color: #10b981; border-color: rgba(16, 185, 129, 0.2);">${licenseKey}</div>
                </div>
                ` : ''}
                
                <p>This configuration includes your full domain schema, agent optimization rules, and infrastructure boilerplate as defined in the Keystone Workspace.</p>
              </div>

              <div class="footer">
                <p>Materialized via Keystone Architect Agent</p>
                <p>&copy; 2026 K+ Engineering</p>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject,
      html,
      from: "Keystone <keystone@k-plus.one>",
    });
  },
});
