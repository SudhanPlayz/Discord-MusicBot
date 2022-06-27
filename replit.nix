{ pkgs }: {
  deps = [
    pkgs.nodejs-16_x, 
    pkgs.nodePackages_latest.npm
  ];
}
