export default {
  schema: "prisma/schema.prisma",
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL || "file:./dummy.db",
  },
};
