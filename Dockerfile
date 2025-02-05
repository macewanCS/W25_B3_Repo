FROM amazoncorretto:21-alpine AS build
COPY --chown=gradle:gradle ./backend /home/lyrne/src
WORKDIR /home/lyrne/src
RUN gradle build --no-daemon

FROM amazoncorretto:21-alpine

RUN mkdir /app
COPY --from=build /home/lyrne/src/build/libs/*.jar /app/lyrne.jar

EXPOSE 8820
ENTRYPOINT ["java", "-XX:+UnlockExperimentalVMOptions", "-XX:+UseCGroupMemoryLimitForHeap", "-Djava.security.egd=file:/dev/./urandom","-jar","/app/lyrne.jar"]