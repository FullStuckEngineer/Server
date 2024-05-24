const axios = require("axios");
const prisma = require("../lib/prisma.js");
const bcrypt = require("../lib/bcrypt.js");
const generateSlug = require("../lib/slug.js");

async function main() {
//   const users = await prisma.user.create({
//     data: {
//       email: "user@gmail.com",
//       name: "Dono",
//       role: "user",
//       password: bcrypt.hashPassword("userpass1"),
//       phone_number: "+6282194290000",
//       addresses: {
//         create: [
//           {
//             receiver_name: "Dono",
//             receiver_phone: "+6282100001111",
//             detail_address: "JL.Satwamarga no.33",
//             city_id: 92,
//             province: "Jawa Barat",
//             postal_code: 89933
//           },
//         ],
//       },
//     },
//   });


//   await prisma.user.create({
// data:{
    
//         email: "user2@gmail.com",
//         name: "Usman",
//         role: "user",
//         password: bcrypt.hashPassword("userpass2"),
//         phone_number: "+6282194233333",    
//         addresses:{
//             create:[
//                 {
//                     receiver_name: "Adnan",
//                     receiver_phone: "+6282192221111",
//                     detail_address: "JL.Gatotwaluyo no.82",
//                     city_id: 182,
//                     province:"Sulawesi Tenggara",
//                     postal_code: 88002
//                 }
//             ]
//         }
// }
//   })

// const admin = await prisma.user.create({
//     data: { 
//         email: "admin@gmail.com",
//         name: "Adnan",
//         role: "admin",
//         password: bcrypt.hashPassword("adminpass2"),
//         phone_number:"+6282192221111",
      

//     }
// })

 

// const stores = await prisma.store.create({
//     data: { 
//         name: "BabyBoo",
//         city_id: 153,
//         province: "Jabodetabek",
//         postal_code: "22991",
//         bank_account_number:"224144566",
      

//     }
// })

 await prisma.category.create({
    data: {
        name: "Pakaian",
        products:{
            create:[
                {
                    name: "Baju putih",
                                photo: "https://i.pinimg.com/564x/f4/7c/b2/f47cb27c79a8c268515f934a1b34e924.jpg",
                                description:"Baju putih, atau pakaian putih, adalah pilihan yang sering dipilih untuk berbagai kesempatan khusus. Temukan inspirasi gaya dan padanan baju putih yang sesuai dengan Anda di sini.",
                                price: 80000,
                                weight: 800,
                                stock: 20,
                                sku: "Clothing_BAJU_001",
                                slug: generateSlug("bajuputih"),
                                keywords: "fashion" ,
                            
                              
                },
                {
                    name: "Celana Biru",
                    photo: "https://i.pinimg.com/564x/e7/06/77/e70677d2ed7efa92ce54d2d5af43ce39.jpg",
                    description:"Temukan koleksi celana pendek biru terbaru di sini! Lihat berbagai pilihan dan gaya celana pendek biru untuk tampil trendy dan stylish.",
                    price: 40000,
                    weight: 500,
                    stock: 12,
                    sku: "Clothing_Celana_002",
                    slug: generateSlug("celana pendek"),
                    keywords: "Celana Pendek"
        
                },
                {
                    name: "Overall Bayi",
                    photo: "https://i.pinimg.com/564x/f8/3a/54/f83a544726e3ea1d89b30f4a7521bdff.jpg",
                    description:"Baju overal bayi.",
                    price: 200000,
                    weight: 2000,
                    stock: 20,
                    sku: "Clothing_Celana_003",
                    slug: generateSlug("baju overall"),
                    keywords: "baju"
        
                },
                {
                    name: "Set Baju dinosaurus",
                    photo: "https://i.pinimg.com/736x/dc/79/4b/dc794be218267061d5319136051d0e9d.jpg",
                    description:"Baju overal bayi.",
                    price: 250000,
                    weight: 3000,
                    stock: 20,
                    sku: "Clothing_Celana_004",
                    slug: generateSlug("baju dinosaurus"),
                    keywords: "baju"
        
                },
                {
                    name: "Topi Bayi",
                    photo: "https://i.pinimg.com/564x/89/fa/a0/89faa0f5ede640886a8978bb3492fa03.jpg",
                    description:"Topi bayi.",
                    price: 100000,
                    weight: 1000,
                    stock: 30,
                    sku: "Clothing_Celana_005",
                    slug: generateSlug("topi"),
                    keywords: "Topi"
        
                },
            ]
        }
    }
})


await prisma.category.create({
    data: {
        name: "Sepatu",
        products:{
            create:[
                {
                    name: "Sepatu Noki",
                                photo: "https://i.pinimg.com/564x/45/bc/62/45bc62b7a794b961438102901e7a5bff.jpg",
                                description:"Sepatu Stylish anak anak",
                                price: 150000,
                                weight: 1300,
                                stock: 40,
                                sku: "SEPATU_001",
                                slug: generateSlug("sepatu noki"),
                                keywords: "fashion" ,
                            
                              
                },
                {
                    name: "Sepatu kelinci",
                    photo: "https://i.pinimg.com/564x/38/76/44/38764450a8fbcb2780e8e476c74a3166.jpg",
                    description:"sepatu kelinci anak perempuan.",
                    price: 90000,
                    weight: 700,
                    stock: 12,
                    sku: "Sepatu_002",
                    slug: generateSlug("sepatu kelinci"),
                    keywords: "fashion"
        
                },
                {
                    name: "Sepatu Hijau",
                    photo: "https://i.pinimg.com/564x/f8/aa/d0/f8aad094d464c662b1a798a4517b3b41.jpg",
                    description:"Koleksi sepatu hijau anak anak.",
                    price: 80000,
                    weight: 800,
                    stock: 11,
                    sku: "sepatu_003",
                    slug: generateSlug("sepatu hijau"),
                    keywords: "fashion"
        
                },
            ]
        }
        
    }
})

await prisma.category.create({
    data: {
        name: "Perlengkapan Makan",
        products:{
            create:[
                {
                    name: "Baby Toddler Utensils",
                                photo: "https://i.pinimg.com/564x/92/52/d5/9252d5b761570a38bcb7c85f5fb04cf9.jpg",
                                description:"Paket lengkap alat makan untuk bayi",
                                price: 200000,
                                weight: 3000,
                                stock: 11,
                                sku: "Alat_Makan_001",
                                slug: generateSlug("alat makan"),
                                keywords: "alat" ,
                            
                              
                },
                {
                    name: "Sendok Plastik",
                    photo: "https://i.pinimg.com/564x/52/7e/b5/527eb5203253768808cf833e6d4983d5.jpg",
                    description:"Sendok Plastik warna warni.",
                    price: 20000,
                    weight: 400,
                    stock: 50,
                    sku: "Alat_makan_002",
                    slug: generateSlug("Sendok Warna"),
                    keywords: "alat"
        
                },
                {
                    name: "Sendok Kodok",
                    photo: "https://i.pinimg.com/564x/d4/c3/82/d4c382f70bb576d7eca72f59eeea0a9d.jpg",
                    description:"Sendok Stainless Steel.",
                    price: 100000,
                    weight: 1500,
                    stock: 21,
                    sku: "Alat_makan_003",
                    slug: generateSlug("Sendok Stainless"),
                    keywords: "alat"
        
                },
            ]
        }
        
    }
})


await prisma.category.create({
    data: {
        name: "Perlengkapan Mandi",
        products: {
            create:[
                {
                    name: "Handuk",
                                photo: "https://i.pinimg.com/564x/90/35/6e/90356ee0d71498b9baf73ab2386acc80.jpg",
                                description:"Handuk adalah sejenis kain atau serbet yang digunakan sebagai alat untuk menyeka tubuh setelah mandi.",
                                price: 120000,
                                weight: 1500,
                                stock: 8,
                                sku: "Handuk_003",
                                slug: generateSlug("handuk"),
                                keywords: "mandi"
                },
                {
                    name: "sabun Mandi",
                    photo: "https://i.pinimg.com/564x/c9/56/da/c956da602e09c253a0e3ddc324c0358d.jpg",
                    description:"Sabun Mandi anak.",
                    price: 200000,
                    weight: 3000,
                    stock: 50,
                    sku: "Alat_mandi_002",
                    slug: generateSlug("sabun mandi"),
                    keywords: "mandi"
        
                },
                {
                    name: "tempat Sabun Kodok",
                    photo: "https://i.pinimg.com/564x/fc/c0/8c/fcc08c7ad3aabfb28c579a37c526d8ce.jpg",
                    description:"Sendok Stainless Steel.",
                    price: 120000,
                    weight: 2000,
                    stock: 21,
                    sku: "Alat_mandi_003",
                    slug: generateSlug("Wadah sabun"),
                    keywords: "alat"
        
                },
            ]
        }

    }
})


await prisma.category.create({
    data: {
        name: "Perlengkapan Renang",
        products: {
            create:[
                {
                    name: "Kaca Mata Renang",
                                photo: "https://i.pinimg.com/736x/5f/2b/5a/5f2b5ad142a741928e7dfc95bf69dc73.jpg",
                                description:"Handuk adalah sejenis kain atau serbet yang digunakan sebagai alat untuk menyeka tubuh setelah mandi.",
                                price: 50000,
                                weight: 600,
                                stock: 5,
                                sku: "Kaca_Mata_003",
                                slug: generateSlug("Kaca mata renang"),
                                keywords: "kaca mata"   
                },
                {
                    name: "Pelampung bayi",
                    photo: "https://i.pinimg.com/736x/cf/50/80/cf508069339b0b84167e7bcadd297be5.jpg",
                    description:"Pelampung renang bayi.",
                    price: 100000,
                    weight: 1500,
                    stock: 20,
                    sku: "pelampung_003",
                    slug: generateSlug("Pelampung"),
                    keywords: "pelampung"
        
                },
              
                
            ]
        }
    }
})




  

  let cities = await axios.get('https://api.rajaongkir.com/starter/city', {
        headers: {
            key: process.env.RAJAONGKIR_API_KEY
        }
    })
    
    
    cities = cities.data.rajaongkir.results.map((city) => {
        return {
            id: +city.city_id,
            name: city.city_name
        }
    })
    
    await prisma.city.createMany({
        data: cities
    })
   
    console.log("City Seeding Success")
 

const couriers = await prisma.courier.createMany({
    data:[
        {
            name: "jne"
        },
        {
            name: "pos"
        },
        {
            name: "tiki"
        }
    ]
})

   

  process.exit();
}

main();

