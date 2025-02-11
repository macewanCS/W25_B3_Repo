package com.lyrne.backend;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import io.javalin.security.RouteRole;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import me.mrnavastar.sqlib.api.DataContainer;
import me.mrnavastar.sqlib.api.types.JavaTypes;

import org.joda.time.DateTime;
import org.joda.time.Interval;

import java.util.ArrayList;
import java.util.Optional;

@Getter
@Setter
@RequiredArgsConstructor
public class User {

    public enum Role implements RouteRole { ANYONE, STUDENT, PARENT, TUTOR }

    private transient boolean dirty = false; // Don't save this to database - is used to mark whether this user is out of sync with db

    // All users
    private final String id;
    public Role role = Role.ANYONE; // had to make it public to determine which store to put it in, unless there's a better way i don't know about
    private DateTime created;
    private DateTime lastLogin;

    private String username;
    private String email;
    private String phone;
    private String icon; // this can just be a base64 encoded png or some shit
    private String[] subjects; // i figure subjects fits better in the user than in the timeslot. also maybe an ArrayList over an Array? not sure what difference it makes in java

    // TODO: idk if this is the best way to store availability, but it seems simple enough??
    private final ArrayList<Interval> availability = new ArrayList<>();

    // needed to make a constructor to test
    public User(String id, String username, String email, String phone){ 
        this.id = id;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.created = new DateTime();

    }
    public User(DataContainer container){ // create a user from the database. forgive me if this is not how we should do it but its how i think this works
        Optional<String> id = container.get(JavaTypes.STRING, "id");
        if (id.isPresent()) this.id = id.get();
        else this.id = null; 

        this.load(container);
    }

    public JsonObject asJson() {
        return Main.GSON.toJsonTree(this).getAsJsonObject();
    }

    public static User fromJson(JsonElement json) {
        return Main.GSON.fromJson(json, User.class);
    }

    public void update(JsonObject json) {
        JsonObject original = this.asJson();
        for (String keys : json.keySet()) {
            JsonElement element = json.get(keys);
            if (element != null) original.add(keys, element);
        }

        User updated = fromJson(original);
        this.role = updated.role;
        this.username = updated.username;
        this.email = updated.email;
        this.phone = updated.phone;
        this.icon = updated.icon;
        this.dirty = true;
    }

    @Override
    public String toString() {
        return asJson().toString();
    }

    public void store(DataContainer container) { // lowkey not sure how to best do "subjects" 
        container.put(JavaTypes.STRING, "id", this.id);
        container.put(JavaTypes.STRING, "username", this.username);
        container.put(JavaTypes.STRING, "email", this.email);
        container.put(JavaTypes.STRING, "phone", this.phone);
        container.put(JavaTypes.STRING, "icon", this.icon);
        container.put(JavaTypes.INT, "role", this.role.ordinal());
        if (this.lastLogin != null) container.put(JavaTypes.STRING, "lastlogin", this.lastLogin.toString());
        container.put(JavaTypes.STRING, "created", this.created.toString());
    }

    public void load(DataContainer container) {
        
        Optional<String> un = container.get(JavaTypes.STRING, "username");
        Optional<String> em = container.get(JavaTypes.STRING, "email");
        Optional<String> ph = container.get(JavaTypes.STRING, "phone");
        Optional<String> ic = container.get(JavaTypes.STRING, "icon");
        Optional<Integer> ro = container.get(JavaTypes.INT, "role");
        Optional<String> ll = container.get(JavaTypes.STRING, "lastlogin");
        Optional<String> cr = container.get(JavaTypes.STRING, "created");

        if (un.isPresent()) this.username = un.get(); 
        if (em.isPresent()) this.email = em.get(); 
        if (ph.isPresent()) this.phone = ph.get();
        if (ic.isPresent()) this.icon = ic.get();
        if (ro.isPresent()) this.role = Role.values()[ro.get()];
        if (ll.isPresent()) this.lastLogin = DateTime.parse(ll.get());
        if (cr.isPresent()) this.created = DateTime.parse(cr.get());
    }
    public void printInfo(){ // just for testin
        System.out.println(this.username);
        System.out.println(this.email);
        System.out.println(this.phone);
        System.out.println(this.created.toString());
    }

}
