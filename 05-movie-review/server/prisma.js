// @prisma/client 패키지 속 PrismaClient 항목만 꺼내므로 중괄호 필요
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
module.exports = prisma;
