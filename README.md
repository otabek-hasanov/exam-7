# Real Estate Marketplace — Backend

Ko‘chmas mulk e’lonlari platformasi uchun API. Foydalanuvchilar sotuv (SALE) yoki ijara (RENT) e’lonlarini ko‘radi, qidiradi, saqlaydi va sotuvchiga murojaat yuboradi. Seller o‘z e’lonlarini boshqaradi, Admin e’lonlarni tasdiqlaydi yoki rad etadi.

## Jamoa

| Ism | Rol |
| --- | --- |
| Otabek Hasanov | Backend |
|  |  |
|  |  |

## Texnologiyalar

- NestJS
- PostgreSQL + Prisma
- JWT, bcrypt
- class-validator (DTO)
- Multer (rasm yuklash)
- Swagger

## Ishga tushirish

1. Paketlarni o‘rnatish:

```bash
npm install
```

2. `.env.example` dan nusxa olib `.env` fayl yarating va qiymatlarni to‘ldiring:

```bash
cp .env.example .env
```

3. Bazada jadvallarni yaratish:

```bash
npx prisma migrate deploy
```

4. Test ma’lumotlarni qo‘shish:

```bash
npm run seed
```

5. Serverni ishga tushirish:

```bash
npm run start:dev
```

Server: http://localhost:3000
Swagger: http://localhost:3000/api/docs

## .env o‘zgaruvchilari

| Nomi | Nima uchun |
| --- | --- |
| `DATABASE_URL` | PostgreSQL ulanish manzili |
| `JWT_SECRET` | JWT token uchun maxfiy kalit |
| `JWT_EXPIRES_IN` | Token amal qilish muddati (masalan `1d`) |
| `PORT` | Server porti (standart `3000`) |

## Internetsiz ishga tushirish

Kompyuterga PostgreSQL o‘rnating, bo‘sh baza yarating va `.env` da local manzilni yozing:

```
DATABASE_URL="postgresql://postgres:PAROL@localhost:5432/real_estate?schema=public"
```

Keyin yuqoridagi 3, 4, 5-qadamlarni bajaring.

## Test hisoblar

Hammasining paroli: `password123`

| Email | Rol |
| --- | --- |
| admin@mail.uz | ADMIN |
| ali@mail.uz | USER (seller) |
| vali@mail.uz | USER (seller) |
| aziz@mail.uz | USER |

## Endpointlar

🌐 — login shart emas, 🔑 — login kerak, 👤 — faqat egasi, 🛡️ — faqat Admin

**Auth**

- `POST /auth/register` 🌐
- `POST /auth/login` 🌐
- `GET /auth/me` 🔑

**Users**

- `GET /users/me` 🔑
- `PATCH /users/me` 🔑

**Categories**

- `GET /categories` 🌐
- `POST /categories` 🛡️
- `PATCH /categories/:id` 🛡️
- `DELETE /categories/:id` 🛡️

**Properties**

- `GET /properties` 🌐 — query: `page`, `limit`, `city`, `category`, `type`, `minPrice`, `maxPrice`, `rooms`, `sort`
- `GET /properties/my` 🔑
- `GET /properties/:id` 🌐
- `POST /properties` 🔑
- `PATCH /properties/:id` 👤
- `DELETE /properties/:id` 👤

**Images**

- `POST /properties/:id/images` 👤 — `multipart/form-data`, maydon nomi `images`
- `DELETE /properties/:id/images/:imageId` 👤

**Favorites**

- `GET /favorites` 🔑
- `POST /favorites/:propertyId` 🔑
- `DELETE /favorites/:propertyId` 🔑

**Inquiries**

- `POST /properties/:propertyId/inquiries` 🔑
- `GET /inquiries/my` 🔑

**Admin**

- `GET /admin/properties?status=PENDING` 🛡️
- `PATCH /admin/properties/:id/status` 🛡️
- `GET /admin/users` 🛡️

## Qoidalar

- Yangi e’lon doim `PENDING` bo‘lib yaratiladi.
- Public ro‘yxatda faqat `APPROVED` e’lonlar ko‘rinadi.
- E’lon statusini faqat Admin o‘zgartiradi. Seller e’lonni tahrirlasa status o‘zgarmaydi.
- Seller faqat o‘z e’lonini o‘zgartiradi va o‘chiradi.
- Bitta e’lonni favorites’ga faqat bir marta qo‘shish mumkin.
- O‘z e’loniga murojaat yuborib bo‘lmaydi.
- Kategoriyalarni faqat Admin qo‘shadi, o‘zgartiradi va o‘chiradi.
- Ichida e’loni bor kategoriyani o‘chirib bo‘lmaydi.
- `category` filtri kategoriya `id` si bilan ishlaydi (masalan `?category=3`).
- `sort`: `price_asc`, `price_desc`, `newest`.
- Rasm: faqat jpg, png, webp, har biri 5 MB gacha. Rasmlar `/uploads/...` manzilida ochiladi.
- Ro‘yxatdan o‘tganda rol doim `USER` bo‘ladi. Admin bazada qo‘lda yoki seed orqali yaratiladi.
