package com.cloud.kubernete.auth;

public class AuthResult {

    boolean check;
    String message;

    public AuthResult(){}

    public AuthResult(boolean check,String message){
        this.check = check;
        this.message = message;
    }

    public boolean isCheck() {
        return check;
    }

    public void setCheck(boolean check) {
        this.check = check;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public static AuthResult error(String mesg){
        return new AuthResult(false,mesg);
    }

    public static AuthResult success = new AuthResult(true,null);
}