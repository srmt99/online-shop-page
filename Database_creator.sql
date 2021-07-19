use shop;

-- creating the USERs table
CREATE TABLE Users (  
    username varchar(255) NOT NULL ,  
    password varchar(255) NOT NULL ,
	name varchar(255) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,
	lastname varchar(255) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,
	address varchar(1000) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,
	credit int DEFAULT 0,
    PRIMARY KEY (username)
	); 

-- creating the ADMIN table
CREATE TABLE Admin (  
    username varchar(255) NOT NULL,  
    password varchar(255) NOT NULL ,
    PRIMARY KEY (username)
	); 

-- creating the CATEGORIES table
CREATE TABLE Categories (
    name varchar(255) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,
    PRIMARY KEY (name)
	); 

-- creating the PRODUCTs table
CREATE TABLE Products (
	p_id int IDENTITY(1,1),
	name varchar(255) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,
	category varchar(255) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL DEFAULT 'uncategorized',
	price int NOT NULL,
	available int DEFAULT 0,
	sold int DEFAULT 0,
	picture VARBINARY(MAX),
    PRIMARY KEY (p_id),
	CONSTRAINT BelongsToCat FOREIGN KEY (category)
    REFERENCES Categories (name)
    ON UPDATE CASCADE
	); 

-- creating the RECEIPTs table
CREATE TABLE Receipts (
	r_code varchar(10) NOT NULL,
	name varchar(255) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,
	number_sold int NOT NULL,
	buyer_firstname varchar(255) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,
	buyer_lastname varchar(255) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,
	buyer_address varchar(1000) COLLATE Latin1_General_100_CI_AI_SC_UTF8 NOT NULL,
	price int NOT NULL,
	buy_date datetime DEFAULT CURRENT_TIMESTAMP,
	status varchar(20) DEFAULT 'pending',
    PRIMARY KEY (r_code)
	); 

-- INSERTS
-- inserting the one and only admin
INSERT INTO Admin VALUES ('jesus','bebackin3');

-- inserting the uncategorized category
INSERT INTO Categories VALUES ('uncategorized');

-- TRIGGERS
-- trigger on user email
GO
CREATE TRIGGER user_email  
ON Users FOR update  
AS
IF UPDATE(username)
	BEGIN
		PRINT 'user emails are unchangeable'  
		ROLLBACK;
	END

-- trigger on receipt info
GO
CREATE TRIGGER receipt_change  
ON Receipts FOR update  
AS
BEGIN
    IF UPDATE(status) RETURN
	ELSE
		BEGIN
			PRINT 'receipt info are unchangeable'
			ROLLBACK
		END
END

-- trigger on category deletion
GO
CREATE TRIGGER category_deletion  
ON Categories INSTEAD OF DELETE 
AS
BEGIN
    update Products set category = 'uncategorized' where Products.category = (SELECT deleted.name FROM deleted)
	DELETE Categories WHERE name = (SELECT deleted.name FROM deleted)
END
