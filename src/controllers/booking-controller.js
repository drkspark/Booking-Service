const { StatusCodes } = require('http-status-codes');
const { REMINDER_BINDING_KEY } = require('../config/serverConfig');
const { BookingService } = require('../services/index');

const {createChannel, publishMessage} = require('../utils/messageQueue');

const bookingService = new BookingService();

class BookingController {
    // constructor() {
    // }

    async sendMessageToQueue(Req, res) {
        const channel = await createChannel();
        const payload = {
            data: {
                subject: 'This is a notification from Queue',
                content: 'Some queue will subscribe to this',
                recepientEmail: '20r01a6720@cmritonline.ac.in',
                notificationTime: '2023-03-17T13:30:00'
            },
            service: 'CREATE_TICKET'
        };
        publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
        return res.status(200).json({
            message: 'Successfully published the event'
        });
    }
    
    async create (req, res) {
        try {
            const response = await bookingService.createBooking(req.body);
            console.log("FROM BOOKING CONTROLLER", response);
            return res.status(StatusCodes.OK).json({
                message: 'Successfully completed booking',
                success: true,
                err: {},
                data: response
            });
        } catch (error) {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                err: error.explaination,
                data: {}
            });
        }
    }
}

module.exports = BookingController;