import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { mkdirSync, writeFileSync } from 'fs';
import { crc32, deflateSync } from 'zlib';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

function makePng(width: number, height: number, color: number[]) {
  const rows: Buffer[] = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 3);
    const light = 1 - (y / height) * 0.35;
    for (let x = 0; x < width; x++) {
      row[1 + x * 3] = Math.round(color[0] * light);
      row[2 + x * 3] = Math.round(color[1] * light);
      row[3 + x * 3] = Math.round(color[2] * light);
    }
    rows.push(row);
  }

  const chunk = (type: string, data: Buffer) => {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([length, body, crc]);
  };

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const colors = [
  [70, 130, 180],
  [46, 139, 87],
  [205, 133, 63],
  [147, 112, 219],
  [220, 120, 120],
  [100, 149, 237],
  [218, 165, 32],
  [72, 61, 139],
];

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@mail.uz' },
    update: { role: 'ADMIN' },
    create: {
      fullName: 'Admin',
      email: 'admin@mail.uz',
      phone: '+998901112233',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const seller1 = await prisma.user.upsert({
    where: { email: 'ali@mail.uz' },
    update: {},
    create: {
      fullName: 'Ali Valiyev',
      email: 'ali@mail.uz',
      phone: '+998901234567',
      passwordHash,
    },
  });

  const seller2 = await prisma.user.upsert({
    where: { email: 'vali@mail.uz' },
    update: {},
    create: {
      fullName: 'Vali Karimov',
      email: 'vali@mail.uz',
      phone: '+998907654321',
      passwordHash,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'aziz@mail.uz' },
    update: {},
    create: {
      fullName: 'Aziz Rahimov',
      email: 'aziz@mail.uz',
      phone: '+998935554433',
      passwordHash,
    },
  });

  const categoriesData = [
    { name: 'Kvartira', slug: 'kvartira' },
    { name: 'Hovli', slug: 'hovli' },
    { name: 'Ofis', slug: 'ofis' },
    { name: 'Yer uchastka', slug: 'yer-uchastka' },
  ];

  const categories: any = {};
  for (const item of categoriesData) {
    categories[item.slug] = await prisma.category.upsert({
      where: { slug: item.slug },
      update: { name: item.name },
      create: item,
    });
  }

  await prisma.property.deleteMany({
    where: { userId: { in: [seller1.id, seller2.id] } },
  });

  const propertiesData = [
    {
      title: 'Chilonzorda 3 xonali kvartira',
      description: 'Yangi remont qilingan, metroga 5 daqiqa, mebeli bilan.',
      price: 65000,
      currency: 'USD',
      listingType: 'SALE',
      status: 'APPROVED',
      address: 'Chilonzor 9-kvartal, 12-uy',
      city: 'Toshkent',
      area: 78,
      rooms: 3,
      bathrooms: 1,
      category: 'kvartira',
      userId: seller1.id,
    },
    {
      title: 'Yunusobodda 2 xonali kvartira ijaraga',
      description: 'Oilaga beriladi, barcha jihozlar bor, internet ulangan.',
      price: 450,
      currency: 'USD',
      listingType: 'RENT',
      status: 'APPROVED',
      address: 'Yunusobod 4-mavze, 25-uy',
      city: 'Toshkent',
      area: 56,
      rooms: 2,
      bathrooms: 1,
      category: 'kvartira',
      userId: seller1.id,
    },
    {
      title: 'Samarqandda katta hovli',
      description: 'Bog‘i bor, 6 sotix yer, garaj va yozgi oshxona mavjud.',
      price: 120000,
      currency: 'USD',
      listingType: 'SALE',
      status: 'APPROVED',
      address: 'Registon ko‘chasi, 40-uy',
      city: 'Samarqand',
      area: 220,
      rooms: 6,
      bathrooms: 2,
      category: 'hovli',
      userId: seller2.id,
    },
    {
      title: 'Mirobodda ofis ijaraga',
      description: 'Biznes markazda, 2-qavat, parkovka va qo‘riqlash bor.',
      price: 12000000,
      currency: 'UZS',
      listingType: 'RENT',
      status: 'APPROVED',
      address: 'Amir Temur ko‘chasi, 15',
      city: 'Toshkent',
      area: 90,
      rooms: 4,
      bathrooms: 1,
      category: 'ofis',
      userId: seller2.id,
    },
    {
      title: 'Buxoroda 1 xonali kvartira',
      description: 'Shahar markazida, talabalar uchun qulay, arzon narxda.',
      price: 28000,
      currency: 'USD',
      listingType: 'SALE',
      status: 'APPROVED',
      address: 'Navoiy shoh ko‘chasi, 7-uy',
      city: 'Buxoro',
      area: 38,
      rooms: 1,
      bathrooms: 1,
      category: 'kvartira',
      userId: seller1.id,
    },
    {
      title: 'Toshkent viloyatida yer uchastka',
      description: 'Zangiota tumanida 10 sotix yer, gaz va svet yaqin.',
      price: 35000,
      currency: 'USD',
      listingType: 'SALE',
      status: 'APPROVED',
      address: 'Zangiota tumani, Bog‘ ko‘chasi',
      city: 'Toshkent',
      area: 1000,
      rooms: 1,
      bathrooms: 0,
      category: 'yer-uchastka',
      userId: seller2.id,
    },
    {
      title: 'Sergelida 4 xonali kvartira',
      description: 'Yangi uy, 5-qavat, lift bor, hali admin tasdiqlamagan.',
      price: 72000,
      currency: 'USD',
      listingType: 'SALE',
      status: 'PENDING',
      address: 'Sergeli 7-mavze, 3-uy',
      city: 'Toshkent',
      area: 95,
      rooms: 4,
      bathrooms: 2,
      category: 'kvartira',
      userId: seller1.id,
    },
    {
      title: 'Namanganda hovli ijaraga',
      description: 'Ma’lumotlari to‘liq emas, admin tomonidan rad etilgan.',
      price: 300,
      currency: 'USD',
      listingType: 'RENT',
      status: 'REJECTED',
      address: 'Davlatobod tumani, 18-uy',
      city: 'Namangan',
      area: 150,
      rooms: 5,
      bathrooms: 1,
      category: 'hovli',
      userId: seller2.id,
    },
  ];

  mkdirSync('uploads', { recursive: true });

  for (let i = 0; i < propertiesData.length; i++) {
    const item = propertiesData[i];

    const property = await prisma.property.create({
      data: {
        title: item.title,
        description: item.description,
        price: item.price,
        currency: item.currency,
        listingType: item.listingType as any,
        status: item.status as any,
        address: item.address,
        city: item.city,
        area: item.area,
        rooms: item.rooms,
        bathrooms: item.bathrooms,
        categoryId: categories[item.category].id,
        userId: item.userId,
      },
    });

    for (let j = 0; j < 2; j++) {
      const fileName = `seed-${i + 1}-${j + 1}.png`;
      const color = colors[(i + j * 3) % colors.length];
      writeFileSync('uploads/' + fileName, makePng(640, 400, color));

      await prisma.propertyImage.create({
        data: {
          url: '/uploads/' + fileName,
          altText: item.title,
          sortOrder: j,
          propertyId: property.id,
        },
      });
    }
  }

  const approved = await prisma.property.findMany({
    where: { status: 'APPROVED', userId: seller1.id },
  });
  const other = await prisma.property.findFirst({
    where: { status: 'APPROVED', userId: seller2.id },
  });

  await prisma.favorite.deleteMany({ where: { userId: user.id } });
  await prisma.inquiry.deleteMany({ where: { senderId: user.id } });

  for (const property of approved.slice(0, 2)) {
    await prisma.favorite.create({
      data: { userId: user.id, propertyId: property.id },
    });
  }

  if (other) {
    await prisma.inquiry.create({
      data: {
        message:
          'Assalomu alaykum, uy hali sotuvdami? Ko‘rishga borsam bo‘ladimi?',
        phone: user.phone ?? '+998935554433',
        senderId: user.id,
        propertyId: other.id,
      },
    });
  }

  console.log('Seed tayyor:');
  console.log('  admin:', admin.email);
  console.log('  sellers:', seller1.email, seller2.email);
  console.log('  user:', user.email);
  console.log('  parol hammasi uchun: password123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
