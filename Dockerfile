# 1단계: 빌드
FROM node:22-alpine AS builder

# 작업 디렉터리 생성
WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 종속성 설치
RUN npm install

# 애플리케이션 소스 복사
COPY . .

# Next.js 빌드
RUN npm run build

# 2단계: 실행
FROM node:22-alpine

WORKDIR /app

# package.json, package-lock.json 복사 후 의존성 설치 (프로덕션 전용)
COPY --from=builder /app/package*.json ./
RUN npm install --production

# 빌드 결과물과 정적 파일 복사
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
#COPY --from=builder /app/next.config.js ./

# 환경 변수
ENV NODE_ENV=production
EXPOSE 3000

# 앱 실행
CMD ["npx", "next", "start"]
