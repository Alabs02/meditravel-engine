import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { ClinicModel } from "@clinic/entities/clinic.entity";
import { UserModel } from "@user/entities/user.entity";
import { ENV } from "@/config";
import { slugify } from "@/core/utils";

async function seedClinics() {
  await mongoose.connect(ENV.MONGODB_URI, { dbName: ENV.MONGODB_NAME });
  console.log("🚀 Connected to MongoDB");

  const admin = await UserModel.findOne({ email: "alabson.inc@gmail.com" });
  if (!admin) {
    console.error("❌ Admin user not found. Seed it first.");
    process.exit(1);
  }

  for (let i = 0; i < 10; i++) {
    const name = `${faker.company.name()} Clinic`;
    const slug = slugify(name);
    const location = `${faker.location.city()}, ${faker.location.country()}`;
    const usCost = faker.number.int({ min: 7000, max: 20000 });
    const intlCost = faker.number.int({ min: 2000, max: 6000 });

    const exists = await ClinicModel.findOne({ clinicSlug: slug });
    if (exists) {
      console.log(`⚠️ Skipped (already exists): ${name}`);
      continue;
    }

    const clinic = await ClinicModel.create({
      clinicName: name,
      clinicSlug: slug,
      location,
      description: faker.lorem.sentences(2),
      gallery: [
        faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
        faker.image.urlPicsumPhotos({ width: 800, height: 600 })
      ],
      procedures: [
        {
          name: faker.commerce.productName(),
          amount: faker.number.int({ min: 1000, max: 4000 })
        },
        {
          name: faker.commerce.productName(),
          amount: faker.number.int({ min: 1000, max: 4000 })
        }
      ],
      clinicEstimatedCost: intlCost,
      usEstimatedCost: usCost,
      saving: usCost - intlCost,
      verified: true,
      isActive: true,
      createdBy: admin._id
    });

    console.log(`✅ Seeded: ${clinic.clinicName}`);
  }

  await mongoose.disconnect();
  console.log("🧹 Disconnected from MongoDB");
  process.exit(0);
}

seedClinics();
