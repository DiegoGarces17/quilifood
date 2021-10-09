class AgregaRollIdAUsuarios < ActiveRecord::Migration[6.1]
  def change
    add_column :usuarios, :rol_id, :integer
    add_foreign_key :usuarios, :roles
  end
end
