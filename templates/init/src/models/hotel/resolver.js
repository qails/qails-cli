import { fetchModels, fetchModel, updateModel, deleteModel } from 'qails';
import Hotel from './model';

export default {
  Query: {
    hotels: fetchModels(Hotel),
    hotel: fetchModel(Hotel)
  },
  Mutation: {
    updateHotel: updateModel(Hotel),
    deleteHotel: deleteModel(Hotel)
  }
};
