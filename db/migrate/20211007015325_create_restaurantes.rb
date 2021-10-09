class CreateRestaurantes < ActiveRecord::Migration[6.1]
  def change
    create_table :restaurantes do |t|
      t.string :nombre

      t.timestamps
    end
  end
end
