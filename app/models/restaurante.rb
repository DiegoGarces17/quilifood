class Restaurante < ApplicationRecord
    
    belongs_to :propietario, class_name: "Usuario" 
    has_one_attached :avatar
    has_one_attached :image
    

    validates :nombre, presence: true
    validates :direccion, presence: true
    validates :telefono, presence: true
    validates :lat, numericality: { greater_than_or_equal_to:  -90, less_than_or_equal_to:  90 }
    validates :lng, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }
end
