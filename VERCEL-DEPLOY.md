# Deploying Fitryx to Vercel

Follow these exact steps to successfully deploy your Fitryx project to Vercel.

## Step 1: Import the Repository
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click the **Add New...** button and select **Project**.
3. Locate your `Fitryx` repository from GitHub and click **Import**.

## Step 2: Configure the Project
When Vercel prompts you to configure the project, ensure the following settings match exactly:

* **Project Name**: `fitryx` (or whatever you prefer)
* **Framework Preset**: **Next.js** (Vercel should automatically detect this)
* **Root Directory**: `./` *(Leave this default unless your code is inside a subfolder)*

### Build and Output Settings
Usually, Vercel detects these automatically, but if it asks, just use the defaults:
* **Build Command**: `next build` 
* **Output Directory**: `.next`
* **Install Command**: `npm install` (or `pnpm install` depending on what you use locally)

## Step 3: Add Environment Variables (CRITICAL)
This is the most important step. Your app will crash in production if it cannot connect to the database.

1. Open the **Environment Variables** section on the Vercel setup page.
2. Open your local `.env` file on your computer.
3. Copy **only** your `DATABASE_URL` line and paste it into Vercel.
   * **Key**: `DATABASE_URL`
   * **Value**: *(Paste your long Neon Postgres connection string here)*
   * *Make sure there are no spaces or quotes around the URL.*

## Step 4: Deploy
1. Click the big **Deploy** button.
2. Wait a couple of minutes for Vercel to install dependencies and build the Next.js app.
3. Once finished, Vercel will give you a live URL where your app is hosted!

## Troubleshooting
* **Database Connection Error**: Double check that you copied the `DATABASE_URL` exactly as it appears in your `.env` file without any extra spaces.
* **CssSyntaxError or Turbopack Errors**: We already removed Turbopack locally, so Vercel's standard Webpack build will execute flawlessly!
