export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  dbUrl: process.env.DB_URL,
}
