import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Đang khởi tạo dữ liệu mẫu cho Mộc Trầm...');

  // 1. Admin User
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@moctram.vn' },
    update: {},
    create: {
      email: 'admin@moctram.vn',
      passwordHash: adminPasswordHash,
      fullName: 'Quản Trị Viên Mộc Trầm',
      phone: '0901234567',
      role: UserRole.admin,
    },
  });
  console.log(`✅ Admin: ${admin.email}`);

  // 2. Categories
  const catVongTay = await prisma.category.upsert({
    where: { slug: 'vong-tay-tram-huong' },
    update: {},
    create: {
      name: 'Vòng Tay Trầm Hương',
      slug: 'vong-tay-tram-huong',
      description: 'Vòng tay trầm hương tự nhiên cao cấp, mang lại bình an và tài lộc.',
      imageUrl: 'https://images.unsplash.com/photo-1611591475852-520f926017b6?w=800',
      displayOrder: 1,
      isActive: true,
    },
  });

  const catNhang = await prisma.category.upsert({
    where: { slug: 'nhang-tram-huong' },
    update: {},
    create: {
      name: 'Nhang Trầm Hương',
      slug: 'nhang-tram-huong',
      description: 'Nhang trầm hương sạch, không tăm, tự nhiên 100% không hóa chất.',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
      displayOrder: 2,
      isActive: true,
    },
  });

  const catTramNu = await prisma.category.upsert({
    where: { slug: 'tram-nu-tram-mieng' },
    update: {},
    create: {
      name: 'Trầm Nụ & Trầm Miếng',
      slug: 'tram-nu-tram-mieng',
      description: 'Nụ trầm xông nhà, trầm miếng giác dùng cho lư xông trầm.',
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
      displayOrder: 3,
      isActive: true,
    },
  });
  console.log('✅ Categories created');

  // 3. Products
  const p1 = await prisma.product.upsert({
    where: { slug: 'vong-tram-huong-108-hat-phap-hoa' },
    update: {},
    create: {
      categoryId: catVongTay.id,
      name: 'Vòng Trầm Hương 108 Hạt Pháp Hoa',
      slug: 'vong-tram-huong-108-hat-phap-hoa',
      sku: 'VT-108-PH',
      shortDescription: 'Chuỗi 108 hạt trầm hương tự nhiên xua tan muộn phiền, tích tụ vượng khí.',
      description: 'Vòng tay 108 hạt biểu trưng cho sự đoạn trừ 108 phiền não, mùi hương ngọt dịu tự nhiên lưu giữ vĩnh cửu.',
      basePrice: 1500000,
      salePrice: 1250000,
      stockQuantity: 30,
      isFeatured: true,
      isActive: true,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1611591475852-520f926017b6?w=800',
            altText: 'Vòng Trầm Hương 108 Hạt',
            displayOrder: 1,
            isPrimary: true,
          },
        ],
      },
      variants: {
        create: [
          { sku: 'VT-108-PH-6MM', name: 'Hạt 6mm (Nữ/Cổ tay nhỏ)', price: 1500000, salePrice: 1250000, stockQuantity: 15 },
          { sku: 'VT-108-PH-8MM', name: 'Hạt 8mm (Nam/Cổ tay vừa)', price: 1800000, salePrice: 1550000, stockQuantity: 15 },
        ],
      },
    },
  });

  const p2 = await prisma.product.upsert({
    where: { slug: 'nhang-tram-khong-tam-thuong-hang' },
    update: {},
    create: {
      categoryId: catNhang.id,
      name: 'Nhang Trầm Không Tăm Thượng Hạng',
      slug: 'nhang-tram-khong-tam-thuong-hang',
      sku: 'NH-KT-TH',
      shortDescription: 'Hộp 50 que nhang trầm nguyên chất, dùng thư giãn và thiền định.',
      description: 'Làm từ bột trầm hương nguyên chất và keo bời lời tự nhiên, khói mỏng thơm thanh ngọt.',
      basePrice: 350000,
      salePrice: 290000,
      stockQuantity: 100,
      isFeatured: true,
      isActive: true,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
            altText: 'Nhang Trầm Không Tăm',
            displayOrder: 1,
            isPrimary: true,
          },
        ],
      },
    },
  });

  const p3 = await prisma.product.upsert({
    where: { slug: 'tram-nu-khoi-nguoc-cao-cap' },
    update: {},
    create: {
      categoryId: catTramNu.id,
      name: 'Trầm Nụ Khói Ngược Cao Cấp (Hộp 40 viên)',
      slug: 'tram-nu-khoi-nguoc-cao-cap',
      sku: 'NU-KN-40',
      shortDescription: 'Nụ trầm thác khói dùng cho thác trầm phong thủy, hương trầm đậm đà.',
      description: 'Thời gian cháy 20-25 phút, khói chảy ngược bồng bềnh như thác mây.',
      basePrice: 280000,
      salePrice: 240000,
      stockQuantity: 80,
      isFeatured: true,
      isActive: true,
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
            altText: 'Trầm Nụ Khói Ngược',
            displayOrder: 1,
            isPrimary: true,
          },
        ],
      },
    },
  });
  console.log('✅ Sample products created');

  // 4. Banners
  await prisma.banner.createMany({
    data: [
      {
        title: 'Mộc Trầm - Tinh Hoa Đất Trời',
        subtitle: 'Trầm hương tự nhiên nguyên bản, thanh tẩy không gian và tụ tài đắc lộc.',
        imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1600',
        linkUrl: '/san-pham',
        displayOrder: 1,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  // 5. Store Settings
  const settings = [
    { key: 'STORE_NAME', value: 'Mộc Trầm Hương' },
    { key: 'HOTLINE', value: '0987.654.321' },
    { key: 'ADDRESS', value: '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh' },
    { key: 'BANK_NAME', value: 'MBBank' },
    { key: 'BANK_ACCOUNT_NO', value: '0987654321' },
    { key: 'BANK_ACCOUNT_NAME', value: 'TRAM HUONG MOC TRAM' },
  ];

  for (const s of settings) {
    await prisma.storeSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log('✅ Store settings created');

  console.log('🎉 Khởi tạo dữ liệu mẫu thành công!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

