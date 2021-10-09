class AgregarPropietarioARestaurante < ActiveRecord::Migration[6.1]
  def change
    add_column :restaurantes, :propietario_id, :integer
    add_foreign_key :restaurantes, :usuarios, column: :propietario_id
  end
end
