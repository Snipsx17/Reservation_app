-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "verified_email" BOOLEAN NOT NULL DEFAULT false,
    "password" VARCHAR(60) NOT NULL,
    "telephone" VARCHAR(12) NOT NULL,
    "token_verificacion" UUID,
    "refreshToken" VARCHAR(100),
    "role" "UserRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurants" (
    "id" SERIAL NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "logo" VARCHAR(256),
    "address" VARCHAR(100) NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "maximum_capacity" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "restaurant_id" INTEGER NOT NULL,
    "shift_name" VARCHAR(50) NOT NULL,
    "week_day" INTEGER NOT NULL,
    "opening_hour" TIME NOT NULL,
    "closing_hour" TIME NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "reservation_block_minutes" INTEGER NOT NULL DEFAULT 30,
    "max_reservations_for_block" INTEGER NOT NULL DEFAULT 1,
    "minimum_advance_booking_time" INTEGER NOT NULL DEFAULT 24,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" SERIAL NOT NULL,
    "code" UUID NOT NULL,
    "restaurant_id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "telephone" VARCHAR(12) NOT NULL,
    "number_of_diners" INTEGER NOT NULL DEFAULT 2,
    "reservation_datetime" TIMESTAMP(3) NOT NULL,
    "status_id" INTEGER NOT NULL,
    "notes" VARCHAR(256),
    "intolerances" VARCHAR(256),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_status" (
    "id" SERIAL NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservation_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_id_key" ON "users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_restaurant_id_key" ON "restaurants"("restaurant_id");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_restaurant_id_week_day_shift_name_key" ON "schedules"("restaurant_id", "week_day", "shift_name");

-- CreateIndex
CREATE UNIQUE INDEX "reservations_code_key" ON "reservations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "reservation_status_status_key" ON "reservation_status"("status");

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "reservation_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
