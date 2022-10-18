CREATE TABLE IF NOT EXISTS grants (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) UNSIGNED NOT NULL,
    grant_name VARCHAR(255) NOT NULL,
    grant_type VARCHAR(255) NOT NULL,
    grant_amount VARCHAR(255) NOT NULL,
    grant_description VARCHAR(255) NOT NULL,
    grant_status enum('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    );