# NodeJS Authentification

해당 프로젝트는 향후 NodeJS/Express를 활용한 백앤드 구현에서
Authentification을 하기위한 boiler project이다.

## Database

---

1. DB는 MongoDB를 사용하였으며, Docker Container에 두었다.
   docker-compose.yml 을 실행하면 된다

```
#> docker-compose up -d
```

## 기능

---

1. User Auth 기능
2. Register
3. Login
4. Logout
5. Reset Password

- 부연으로 로그인 유지는 User model에 token / tokenExp 를 두어 로그인이 되면 해당 값에 채우고, cookie에도 저장하는 방식으로 구현하였다. 즉 auth의 경우 cookie의 토큰값을 가지고와서 해당 토큰을 가지고 있는 유저를 찾는 것으로 구현함
  <br><br>

## 추가로 구현해야할 것

---

1. 구글 로그인 기능
2. 카카오 로그인 기능
