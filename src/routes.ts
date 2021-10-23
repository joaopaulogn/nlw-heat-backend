import { Router } from 'express';
import { AuthenticateUserController } from './controllers/AuthenticateUserController';
import { CreateMessageController } from './controllers/CreateMessageController';
import { Get3LastMessagesController } from './controllers/Get3LastMessagesController';
import { ProfileUserController } from './controllers/ProfileUserController';
import { ensureAuthenticated } from './middlewares/ensureAuthenticated';

const router = Router();

/* O método `handle` recebe os parâmetros request e response,
porém está sendo passado como middleware e, neste caso, não é
necessário passar os parâmetros, pois eles já estão sendo passados
automaticamente pelo express
*/
router.post("/authenticate", new AuthenticateUserController().handle);

router.post("/messages", ensureAuthenticated, new CreateMessageController().handle);

router.get("/messages/last3", new Get3LastMessagesController().handle);

router.get("/profile", ensureAuthenticated, new ProfileUserController().handle);

export { router };