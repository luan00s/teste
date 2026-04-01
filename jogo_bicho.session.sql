DROP TABLE IF EXISTS apostas;

CREATE TABLE apostas (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  animal INT NULL,
  tipo_aposta ENUM('grupo', 'dezena', 'milhar') NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  dezena VARCHAR(2) NULL,
  milhar VARCHAR(4) NULL,
  resultado VARCHAR(20) NULL,
  premio_1 VARCHAR(4) NULL,
  premio_2 VARCHAR(4) NULL,
  premio_3 VARCHAR(4) NULL,
  premio_4 VARCHAR(4) NULL,
  premio_5 VARCHAR(4) NULL,
  valor_ganho DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_apostas_usuario
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);