import {useState} from "react";
import {useRouter} from "next/router";
import {useSearchParams} from "next/navigation";
import {login} from "@/service/authService";
import {
    Box,
    Card,
    CardContent,
    TextField,
    Typography,
    Button
} from "@mui/material";

const LoginPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginRequest = {
            username,
            password
        };

        await login(loginRequest, () => router.push(redirect));
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Card sx={{ width: '100%', maxWidth: 400, p: 2, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" textAlign="center" gutterBottom>
                        로그인
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="아이디"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            type="password"
                            label="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            로그인
                        </Button>
                    </form>

                    {/* 회원가입 버튼 */}
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => router.push('/auth/signup?redirect=' + encodeURIComponent(redirect))}
                        >
                            회원가입
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;
