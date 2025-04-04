const express = require('express');
const router = express.Router();
const { getRooms, getRoomReservations, getRoomById, getReservations, insertReservation, deleteReservation, getReservationById } = require('../../database');

router.get('/', async (req, res) => {
    try {
        const fetchRoomsQuery = await getRooms();        

        if (fetchRoomsQuery !== null) {
            let roomsArr = [];

            for (const room in fetchRoomsQuery) {
                const query = await getRoomReservations(fetchRoomsQuery[room].id);

                if (query !== null) {
                    const reservationsMap = query.map((item) => ({
                        id: item.id,
                        checkin: item.checkin,
                        checkout: item.checkout
                    }));

                    roomsArr.push({
                        id: fetchRoomsQuery[room].id,
                        number: fetchRoomsQuery[room].number,
                        capacity: fetchRoomsQuery[room].capacity,
                        floor: fetchRoomsQuery[room].floor,
                        room_image: fetchRoomsQuery[room].room_image,
                        price: fetchRoomsQuery[room].price,
                        wifi: fetchRoomsQuery[room].wifi,
                        parking: fetchRoomsQuery[room].parking,
                        breakfast: fetchRoomsQuery[room].breakfast,
                        reservations: reservationsMap
                    });
                } else {
                    roomsArr.push({
                        id: fetchRoomsQuery[room].id,
                        number: fetchRoomsQuery[room].number,
                        capacity: fetchRoomsQuery[room].capacity,
                        floor: fetchRoomsQuery[room].floor,
                        room_image: fetchRoomsQuery[room].room_image,
                        price: fetchRoomsQuery[room].price,
                        wifi: fetchRoomsQuery[room].wifi,
                        parking: fetchRoomsQuery[room].parking,
                        breakfast: fetchRoomsQuery[room].breakfast
                    });
                }
            }

            const resp = {
                rooms: roomsArr
            };

            return res.status(200).send(resp);
        } else {
            return res.status(404).json({ error: 'No rooms found!' });
        }
    } catch (err) {
        console.log(err);

        return res.status(500).json({ error: 'Internal server error!' });
    }
});

router.get('/availability/checkin/:checkin/checkout/:checkout', async (req, res) => {
    const checkinDate = req.params.checkin;
    const checkoutDate = req.params.checkout;

    if (!checkinDate || checkinDate === null || checkinDate === undefined) return res.status(404).json({ error: 'Bad checkin date format or date not provided' });

    if (!checkoutDate || checkoutDate === null || checkoutDate === undefined) return res.status(404).json({ error: 'Bad checkout date format or date not provided' });

    try {
        let roomsArr = [];

        const roomsQuery = await getRooms();

        if (roomsQuery !== null) {
            for (const room in roomsQuery) {
                const reservationsQuery = await getRoomReservations(roomsQuery[room].id, checkinDate, checkoutDate);

                if (reservationsQuery !== null) {
                    const resp = {
                        id: roomsQuery[room].id,
                        number: roomsQuery[room].number,
                        availability: false
                    };

                    roomsArr.push(resp);
                } else {
                    const resp = {
                        id: roomsQuery[room].id,
                        number: roomsQuery[room].number,
                        availability: true
                    };

                    roomsArr.push(resp);
                }
            }
        } else {
            return res.status(404).json({ error: 'No rooms found!' });
        }

        const resp = {
            rooms: roomsArr
        };

        return res.status(200).json(resp);
    } catch (err) {
        console.log(err);

        return res.status(500).json({ error: 'Internal server error!' });
    }
});

router.get('/:id', async (req, res) => {
    const room_id = req.params.id;

    if (!room_id || room_id === null || room_id === undefined) return res.status(404).json({ error: 'Room with the specified ID does not exist.' });
    
    try {
        const roomQuery = await getRoomById(room_id);

        const reservationsQuery = await getRoomReservations(room_id);

        if (roomQuery !== null) {
            const resp = {
                id: roomQuery.id,
                number: roomQuery.number,
                capacity: roomQuery.capacity,
                floor: roomQuery.floor,
                room_image: roomQuery.room_image,
                price: roomQuery.price,
                wifi: roomQuery.wifi,
                parking: roomQuery.parking,
                reservations: reservationsQuery ? reservationsQuery.map((item) => ({
                    id: item.id,
                    checkin: item.checkin,
                    checkout: item.checkout
                })) : []
            };

            return res.status(200).json(resp);
        } else {
            return res.status(404).json({ error: 'A room with this ID does not exist' });
        }
    } catch (err) {
        console.log(err);

        return res.status(500).json({ error: 'Internal server error!' });
    }
});

router.post('/reservations', async (req, res) => {
    const { code, name } = req.body;

    if (!code || code === null || code === undefined) return res.status(401).json({ error: 'Unauthorized' });

    if (!name || name === null || name === undefined) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const query = await getReservations(code, name);

        if (query !== null) {
            const resp = {
                reservations: query.map((item) => ({
                    id: item.id,
                    code: code,
                    name: name,
                    created_at: item.created_at,
                    reservation_information: {
                        id: item.id,
                        checkin: item.checkin,
                        checkout: item.checkout,
                        room: {
                            id: item.room_id,
                            number: item.room_number
                        }
                    }
                }))
            };

            return res.status(200).json(resp);
        } else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (err) {
        console.log(err);

        return res.status(500).json({ error: 'Internal server error!' });
    }
});

router.post('/reservations/:id/cancel', async (req, res) => {
    const id = req.params.id;

    if (!id || id === null || id === undefined) return res.status(404).json({ error: 'A reservation with this ID does not exist' });

    const { code, name } = req.body;

    if (!code || code === null || code === undefined) return res.status(401).json({ error: 'Unauthorized' });

    if (!name || name === null || name === undefined) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const roomQuery = await getReservationById(id, code, name);

        if (roomQuery === null) return res.status(404).json({ error: 'A reservation with this ID does not exist' });

        if (roomQuery.code !== code) return res.status(401).json({ error: 'Unauthorized' });

        if (roomQuery.name !== name) return res.status(401).json({ error: 'Unauthorized' });

        const query = await deleteReservation(id, code, name);

        if (query) {
            return res.status(201).json({ message: 'success' });
        } else {
            return res.status(500).json({ error: 'Internal server error!' });
        }
    } catch (err) {
        console.log(err);

        return res.status(500).json({ error: 'Internal server error!' });
    }
});

router.post('/:id/reservation', async (req, res) => {
    const room_id = req.params.id;

    const { name, address, city, zip, country, checkin, checkout } = req.body;

    if (!room_id || room_id === null || room_id === undefined) return res.status(404).json({ error: 'A room with this ID does not exist' });

    let errorFieldsDict = {};

    if (!name || name === null || name === undefined) errorFieldsDict['name'] = 'The name field is required.';

    if (typeof name !== 'string' && name) errorFieldsDict['name'] = 'The name must be a string';

    if (!address || address === null || address === undefined) errorFieldsDict['address'] = 'The address field is required.';

    if (typeof address !== 'string' && address) errorFieldsDict['address'] = 'The address must be a string';

    if (!city || city === null || city === undefined) errorFieldsDict['city'] = 'The city field is required.';

    if (typeof city !== 'string' && address) errorFieldsDict['city'] = 'The city must be a string';

    if (!zip || zip === null || zip === undefined) errorFieldsDict['zip'] = 'The zip field is required.';

    if (typeof zip !== 'string' && zip) errorFieldsDict['zip'] = 'The zip must be a string';

    if (!country || country === null || country === undefined) errorFieldsDict['country'] = 'The country field is required.';

    if (typeof country !== 'string' && country) errorFieldsDict['country'] = 'The country must be a string';

    if (!checkin || checkin === null || checkin === undefined) errorFieldsDict['checkin'] = 'The checkin field is required.';

    if (typeof checkin !== 'string' && checkin) errorFieldsDict['checkin'] = 'The checkin must be a string';

    if (!checkout || checkout === null || checkout === undefined) errorFieldsDict['checkout'] = 'The checkout field is required.';

    if (typeof checkout !== 'string' && checkout) errorFieldsDict['checkout'] = 'The checkout must be a string';

    if (Object.keys(errorFieldsDict).length > 0) {
        const resp = {
            error: 'Validation failed',
            fields: errorFieldsDict
        };

        return res.status(422).json(resp);
    }

    function generateRandomCode(length) {
        const letters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

        let code = '';

        for (let i = 0; i < length; i++) {
            code += letters[Math.round(Math.random() * letters.length)];
        }

        return code;
    }

    try {
        const roomQuery = await getRoomById(room_id);

        if (roomQuery !== null) {
            const generatedCode = generateRandomCode(10);

            const createReservationQuery = await insertReservation(generatedCode, name, address, city, zip, country, checkin, checkout, room_id, roomQuery.number);

            if (createReservationQuery !== false) {
                const resp = {
                    id: createReservationQuery.id,
                    code: generatedCode,
                    name: name,
                    created_at: createReservationQuery.created_at,
                    reservation_information: {
                        id: createReservationQuery.id,
                        checkin: checkin,
                        checkout: checkout,
                        room: {
                            id: room_id,
                            number: roomQuery.number
                        }
                    }
                };

                return res.status(201).json(resp);
            }
        } else {
            return res.status(404).json({ error: 'A room with this ID does not exist' });
        }
    } catch (err) {
        console.log(err);

        return res.status(500).json({ error: 'Internal server error!' });
    }
});

module.exports = router;