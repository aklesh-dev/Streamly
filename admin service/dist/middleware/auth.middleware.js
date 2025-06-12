import axios from 'axios';
import "dotenv/config";
;
export const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            res.status(403).json({ message: 'Unauthorized - Token is missing' });
            return;
        }
        const { data } = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/me`, {
            headers: {
                token,
            },
        });
        req.user = data;
        next();
    }
    catch (error) {
        res.status(403).json({ message: ' Unauthorized - Token is invalid' });
        return;
    }
};
