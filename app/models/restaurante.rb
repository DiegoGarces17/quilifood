class Restaurante < ApplicationRecord
    belongs_to :propietario, class_name: "Usuario"
end
