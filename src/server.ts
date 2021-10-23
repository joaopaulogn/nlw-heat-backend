import { serverHttp } from './app';

// Executando o servidor
serverHttp.listen(4000, () => console.log('Server is running on PORT 4000'));