# Wrangler Configuration Setup

## Security Notice
⚠️ **IMPORTANT**: `wrangler.jsonc` contains sensitive credentials and should NEVER be committed to version control.

## Setup Instructions

1. Copy the example file to create your local configuration:
   ```bash
   cp backend/wrangler.jsonc.example backend/wrangler.jsonc
   ```

2. Edit `backend/wrangler.jsonc` with your actual credentials:
   - `my_db`: Your Prisma Accelerate connection string
   - `JWT_SECRET`: A strong secret for JWT token signing
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

3. The file is already added to `.gitignore` and will be ignored by git.

## Important Security Notes

- ✅ `wrangler.jsonc.example` - Safe to commit (contains no real credentials)
- ❌ `wrangler.jsonc` - NEVER commit this file (contains real credentials)
- Each team member needs to create their own `wrangler.jsonc` from the example file
