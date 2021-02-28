import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://us-central1-clone-5fe02.cloudfunctions.net/api',
});
export default instance;