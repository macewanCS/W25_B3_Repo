package com.lyrne.backend.util;

import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonToken;
import com.google.gson.stream.JsonWriter;
import org.joda.time.Interval;

import java.io.IOException;

public class IntervalAdapter extends TypeAdapter<Interval> {

    @Override
    public void write(JsonWriter writer, Interval interval) throws IOException {
        writer.beginObject();
        writer.name("iStartMillis");
        writer.value(interval.getStartMillis());
        writer.name("iEndMillis");
        writer.value(interval.getEndMillis());
        writer.endObject();
    }

    @Override
    public Interval read(JsonReader reader) throws IOException {
        long start = 0;
        long end = 0;
        reader.beginObject();
        String fieldname = null;

        while (reader.hasNext()) {
            JsonToken token = reader.peek();
            if (token.equals(JsonToken.NAME)) fieldname = reader.nextName();

            if ("iStartMillis".equals(fieldname)) start = reader.nextLong();
            if ("iEndMillis".equals(fieldname)) end = reader.nextLong();
        }
        reader.endObject();
        return new Interval(start, end);
    }
}