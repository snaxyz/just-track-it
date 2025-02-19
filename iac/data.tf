data "external" "env" {
  program = ["bash", "-c", "awk -F '=' '{print $1, substr($0,index($0,$2))}' ../.env | grep -v '^#' | jq -R 'split(\" \") | {(.[0]): .[1]}' | jq -s add"]
}