export const envConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  jwtSecret: process.env.NEXT_PUBLIC_JWT_SECRET,
} as const;

// Validate environment variables
Object.entries(envConfig).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});
