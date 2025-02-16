<?php

class DbConnection
{

    private static array $connections = [];

    public static function getConnection(
        string $host = "db",
        string $dbname = "revvo_db",
        string $username = "root",
        string $password = "root"
    ): PDO {
        $key = "$host-$dbname-$username-$password";

        if (!isset(self::$connections[$key])) {
            self::$connections[$key] = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        }

        return self::$connections[$key];
    }
}
