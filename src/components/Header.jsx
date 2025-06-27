'use client';

import Link from "next/link";
import {usePathname, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import useAuthStore from "@/store/authStore";
import {useRouter} from "next/router";
import {logout, restoreLogin} from "@/service/authService";
import {fetchBoardList} from "@/api/boardApi";

import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    Stack,
    Container,
    Link as MuiLink
} from "@mui/material";

const Header = () => {
    const pathname = usePathname() ?? '';
    const router = useRouter();
    const searchParams = useSearchParams();
    const {isLoggedIn, username, name} = useAuthStore();

    const [boards, setBoards] = useState([]);
    const [redirectUrl, setRedirectUrl] = useState("");

    useEffect(() => {
        const search = searchParams.toString();
        const fullUrl = search ? `${pathname}?${search}` : pathname;
        setRedirectUrl(fullUrl);
    }, [pathname, searchParams]);

    useEffect(() => {
        fetchBoardList()
            .then(setBoards)
            .catch(() => alert("게시판을 불러오지 못했습니다."));
    }, []);

    useEffect(() => {
        restoreLogin();
    }, []);

    return (
        <AppBar position="static" sx={{ backgroundColor: '#333', color: '#fff' }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{justifyContent: 'space-between', flexWrap: 'wrap'}}>
                    {/* 좌측 메뉴 */}
                    <Box component="nav" sx={{display: 'flex', flexWrap: 'wrap', gap: 2}}>
                        <MuiLink
                            component={Link}
                            href="/"
                            underline="none"
                            sx={{
                                px: 1,
                                fontWeight: pathname === '/' ? 'bold' : 'normal',
                                color: pathname === '/' ? 'white' : 'grey.300'
                            }}
                        >
                            Home
                        </MuiLink>
                        {boards.map(b => {
                            const isActive = pathname.startsWith(`/boards/${b.boardId}`);
                            return (
                                <MuiLink
                                    key={b.boardId}
                                    component={Link}
                                    href={`/boards/${b.boardId}/list`}
                                    underline="none"
                                    sx={{
                                        px: 1,
                                        fontWeight: isActive ? 'bold' : 'normal',
                                        color: isActive ? 'white' : 'grey.300'
                                    }}
                                >
                                    {b.boardName}
                                </MuiLink>
                            );
                        })}
                        <MuiLink
                            component={Link}
                            href="/qna/list"
                            underline="none"
                            sx={{
                                px: 1,
                                fontWeight: pathname.startsWith('/qna') ? 'bold' : 'normal',
                                color: pathname.startsWith('/qna') ? 'white' : 'grey.300'
                            }}
                        >
                            문의 게시판
                        </MuiLink>
                    </Box>

                    {/* 우측 로그인 영역 */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{mt: {xs: 2, md: 0}}}>
                        {isLoggedIn ? (
                            <>
                                <Typography color="white">{name}님 안녕하세요!</Typography>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => {
                                        if (!confirm("로그아웃 하시겠습니까?")) return;
                                        logout();
                                    }}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={() => router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl || '/')}`)}
                                >
                                    LOGIN
                                </Button>
                                <Button
                                    variant="contained"
                                    color="info"
                                    onClick={() => router.push(`/auth/signup?redirect=${encodeURIComponent(redirectUrl || '')}`)}
                                >
                                    SIGN-UP
                                </Button>
                            </>
                        )}
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
