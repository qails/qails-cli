import { fetchModels, fetchModel } from 'qails';
import Room from './model';

export default {
  Query: {
    rooms: fetchModels(Room),
    room: fetchModel(Room)
  }
};
