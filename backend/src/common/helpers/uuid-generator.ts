import { v4 as uuidv4 } from 'uuid';

class Uuid {
  generate() {
    return uuidv4();
  }
}

export default new Uuid();
