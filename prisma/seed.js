var request = require("request");
const prisma = require("../lib/prisma");

var options = {
    method: 'GET',
    url: 'https://api.rajaongkir.com/starter/city',
    headers: { key: '6cd80e8ba0ac459d16ef674579802527' }
};

request(options, async function (error, response, body) {
    if (error) {
        console.error(error)
        return
    }

    try {
        const data = JSON.parse(body).rajaongkir.results

        for (const cityData of data) {
            await prisma.city.create({
                data: {
                    id: Number(cityData.city_id),
                    name: cityData.city_name
                }
            })
            console.log(`City ${cityData.city_name} with ID ${cityData.city_id} created`);
        }
    } catch (error) {
        console.error(error)
    } finally {
        await prisma.$disconnect
    }

});
