// Exports resolvers related to products

const { PAGE_SIZE } = require('../../utils/constant');
const Location = require('../../models/location');
const { ErrorTypes } = require('../../utils/error');

module.exports = {
    locations: async (args) => {
        try {
            // Extract args
            var argPage = args.queryPageInput.page;

            let data = await Location.find().skip(argPage * PAGE_SIZE).limit(PAGE_SIZE).exec();
            return data.map((location) => {
                return {
                    ...location._doc
                };
            });
        } catch(e) {
            throw e;
        }
    },
    location: async (args, req) => {
        try {
            // Extract arguments
            var argLocationId = args.queryLocationInput.locationId;

            let result = await Location.findById(argLocationId);
            
            return {
                ...result._doc
            };
        } catch(e) {
            throw e;
        }
    },
    createLocation: async (args, req) => {
        try {
            if(!req.isStaff) {
                throw new Error(ErrorTypes.UNAUTHORIZED);
            }
            
            // Extract arguments
            var argName = args.createLocationInput.name;
            var argAddress = args.createLocationInput.address;
            var argLat = args.createLocationInput.lat;
            var argLng = args.createLocationInput.lng;
            var argPhone = args.createLocationInput.phone;

            if(argName == "") {
                throw new Error(ErrorTypes.NAME_EMPTY);
            }

            if(argAddress == "") {
                throw new Error(ErrorTypes.ADDRESS_EMPTY);
            }

            // Construct product
            const location = new Location({
                name: argName,
                address: argAddress,
                phone: argPhone,
                position: {
                    lat: argLat,
                    lng: argLng
                }
            });
    
            let result = await location.save();
            return { 
                ...result._doc
            };
        } catch(e) {
            throw e;
        }
    }
}