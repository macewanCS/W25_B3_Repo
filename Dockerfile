FROM amazoncorretto:21-alpine AS lyrne-backend
COPY --chown=gradle:gradle ./backend /home/lyrne/src
WORKDIR /home/lyrne/src
RUN ./gradlew build --no-daemon

FROM amazoncorretto:21-alpine

RUN mkdir /app
COPY --from=build /home/lyrne/src/build/libs/*.jar /app/lyrne.jar

EXPOSE 8820
ENTRYPOINT ["java", "-XX:+UnlockExperimentalVMOptions", "-cp","/app/lyrne.jar", "com.lyrne.backend.Main"]

FROM alpine:latest AS lyrne-cdn
ARG GO_FAST_VERSION=0.1.9

RUN apk add --no-cache unzip openssh
ADD https://github.com/kevinanielsen/go-fast-cdn/releases/download/${GO_FAST_VERSION}/go-fast-cdn_${GO_FAST_VERSION}_linux_amd64.zip /tmp/cdn.zip
RUN unzip /tmp/cdn.zip -d /cdn/

EXPOSE 8080
CMD ["/cdn/go-fast-cdn"]
