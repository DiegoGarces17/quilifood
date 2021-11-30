class Restaurante < ApplicationRecord
    
    belongs_to :propietario, class_name: "Usuario" 
    has_one_attached :avatar
    has_one_attached :image
    

    validates :nombre, presence: true
    validates :direccion, presence: true
    validates :telefono, presence: true
end
