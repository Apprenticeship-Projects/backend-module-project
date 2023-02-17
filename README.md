# Backend Module Project

## Installing MongoDB

For the full instructions see the
[official installation page](https://www.mongodb.com/docs/manual/administration/install-community/)

```zsh
brew tap mongodb/brew
brew update
brew install mongodb-community
```

Start the database service:

```zsh
brew services start mongodb-community
```

Enter the mongodb shell:

```zsh
mongosh
```

Create the database:

```zsh
use backend-module-project
```


## JWT Token Setup
Create the keys folder
```zsh
mkdir keys
```

Change directory into the keys folder
```zsh
cd keys
```

Generate a prime256v1 private key
```zsh
openssl ecparam -name prime256v1 -genkey -noout -out private-key.pem
```

Generate the public key from the private key
```zsh
openssl ec -in private-key.pem -pubout > public-key.pem
```

Change directory back into the root project directory.
