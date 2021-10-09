class Usuario < ApplicationRecord
    belongs_to :rol
    has_many :restaurante

     # Include default devise modules. Others available are:
     # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
     devise :database_authenticatable, :registerable,
     :recoverable, :rememberable, :validatable
end
