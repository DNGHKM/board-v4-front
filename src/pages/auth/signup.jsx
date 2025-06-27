'use client';

import { useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { fetchUsernameCheck } from "@/api/authApi";
import { signUp } from "@/service/authService";
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    InputAdornment,
    IconButton
} from "@mui/material";

const USERNAME_MIN = 4;
const USERNAME_MAX = 11;
const PASSWORD_MIN = 4;
const PASSWORD_MAX = 11;
const NAME_MIN = 2;
const NAME_MAX = 4;

const SignUpForm = () => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        passwordCheck: '',
        name: ''
    });
    const [messages, setMessages] = useState({});
    const [usernameChecked, setUsernameChecked] = useState(false);
    const [checking, setChecking] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/auth/login";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setMessages(prev => ({ ...prev, [name]: '' }));

        if (name === 'username') setUsernameChecked(false);
    };

    const validate = () => {
        const errors = {};
        const { username, password, passwordCheck, name } = form;

        if (!username.trim()) errors.username = "아이디를 입력해 주세요";
        else if (username.length < USERNAME_MIN || username.length > USERNAME_MAX)
            errors.username = `아이디는 ${USERNAME_MIN}자 이상 ${USERNAME_MAX}자 이하로 입력해 주세요`;

        if (!password) errors.password = "비밀번호를 입력해주세요";
        else if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX)
            errors.password = `비밀번호는 ${PASSWORD_MIN}자 이상 ${PASSWORD_MAX}자 이하로 입력해 주세요`;
        else if (!/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9_-]+$/.test(password))
            errors.password = "비밀번호는 영문과 숫자를 포함하고 특수문자는 '-'와 '_'만 허용됩니다.";
        else if (username === password)
            errors.password = "아이디와 동일한 비밀번호는 사용할 수 없습니다.";
        else if (/([a-zA-Z0-9_-])\1\1/.test(password))
            errors.password = "동일 문자를 연속 3번 이상 사용할 수 없습니다.";

        if (!passwordCheck) errors.passwordCheck = "비밀번호 확인을 입력해주세요";
        else if (password !== passwordCheck)
            errors.passwordCheck = "비밀번호와 비밀번호 확인이 일치하지 않습니다.";
        else if (!/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9_-]+$/.test(passwordCheck))
            errors.passwordCheck = "비밀번호 확인은 영문과 숫자를 포함하고 특수문자는 '-'와 '_'만 허용됩니다.";

        if (!name.trim()) errors.name = "이름을 입력해 주세요";
        else if (name.length < NAME_MIN || name.length > NAME_MAX)
            errors.name = `이름은 ${NAME_MIN}자 이상 ${NAME_MAX}자 이하로 입력해 주세요`;

        setMessages(errors);
        return Object.keys(errors).length === 0;
    };

    const checkUsername = async () => {
        if (!form.username.trim()) {
            setMessages(prev => ({ ...prev, username: "아이디를 입력해 주세요" }));
            return;
        }

        try {
            setChecking(true);
            const isAvailable = await fetchUsernameCheck(form.username);
            if (isAvailable) {
                alert("사용 가능한 아이디입니다.");
                setUsernameChecked(true);
            } else {
                alert("사용 불가능한 아이디입니다.");
                setUsernameChecked(false);
            }
        } catch (err) {
            console.error(err);
            alert("중복 확인 중 오류가 발생했습니다.");
        } finally {
            setChecking(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!usernameChecked) return alert("아이디 중복 확인을 해주세요.");
        if (!validate()) return;

        try {
            await signUp(form, () => router.push(redirect));
        } catch (err) {
            alert("회원가입 실패: " + (err.response?.data?.message || "알 수 없는 오류"));
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ backgroundColor: '#f8f9fa' }}>
            <Card sx={{ width: '100%', maxWidth: 500, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" textAlign="center" gutterBottom>회원가입</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="아이디"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            error={Boolean(messages.username)}
                            helperText={messages.username || ' '}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button
                                            onClick={checkUsername}
                                            disabled={checking}
                                            variant="outlined"
                                            size="small"
                                        >
                                            중복확인
                                        </Button>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            fullWidth
                            type="password"
                            margin="normal"
                            label="비밀번호"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            error={Boolean(messages.password)}
                            helperText={messages.password || ' '}
                        />
                        <TextField
                            fullWidth
                            type="password"
                            margin="normal"
                            label="비밀번호 확인"
                            name="passwordCheck"
                            value={form.passwordCheck}
                            onChange={handleChange}
                            error={Boolean(messages.passwordCheck)}
                            helperText={messages.passwordCheck || ' '}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="이름"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            error={Boolean(messages.name)}
                            helperText={messages.name || ' '}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                            disabled={!usernameChecked}
                        >
                            회원가입
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default SignUpForm;
