// async function test() {
//     const response = await fetch('http://localhost:3002/module-b/api/v1/rooms/5/reservation', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             name: 'John',
//             address: 'Wall street',
//             zip: '123456',
//             city: 'Kaunas',
//             country: 'Lithuania',
//             checkin: '2025-04-07',
//             checkout: '2025-04-11'
//         })
//     });

//     const resp = await response.json();

//     console.log(resp);
// }

async function test() {
    const response = await fetch('http://localhost:3002/module-b/api/v1/rooms/reservations/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'John',
            code: 'RQUTGV1IIB'
        })
    });

    const resp = await response.json();

    console.log(resp);
}

test();