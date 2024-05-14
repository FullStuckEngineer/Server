const axios = require("axios");
const prisma = require("../lib/prisma.js");
const bcrypt = require("../lib/bcrypt.js");
const generateSlug = require("../lib/slug.js");

async function main() {
// ====================================USER &&  ADDRESS
  const users = await prisma.user.create({
    data: {
      email: "user@gmail.com",
      name: "Dono",
      role: "user",
      password: bcrypt.hashPassword("userpass1"),
      phone_number: "+6282194290000",
      addresses: {
        create: [
          {
            receiver_name: "Dono",
            receiver_phone: "+6282100001111",
            detail_address: "JL.Satwamarga no.33",
            city_id: 92,
            province: "Jawa Barat",
            postal_code: 89933
          },
        ],
      },
    },
  });




const admin = await prisma.user.create({
    data: { 
        email: "admin@gmail.com",
        name: "Adnan",
        role: "admin",
        password: bcrypt.hashPassword("adminpass2"),
        phone_number:"+6282192221111",
        addresses:{
            create:[
                {
                    receiver_name: "Adnan",
                    receiver_phone: "+6282192221111",
                    detail_address: "JL.Gatotwaluyo no.82",
                    city_id: 182,
                    province:"Sulawesi Tenggara",
                    postal_code: 88002
                }
            ]
        }

    }
})









// ====================================CATEGORIES && PRODUCT

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
        
                }
            ]
        }
    }
})


await prisma.category.create({
    data: {
        name: "Alat",
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
                }
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
                }
            ]
        }
    }
})




// ====================================CITY
  

  let cities = await axios.get('https://api.rajaongkir.com/starter/city', {
        headers: {
            key: process.env.RAJAONGKIR_SECRET_KEY
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
 
// ====================================COURIER

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
