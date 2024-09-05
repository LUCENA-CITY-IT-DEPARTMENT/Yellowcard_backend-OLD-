import { IdPicAndSignitureController } from "./controller/IdPicAndSignitureController";
import { UserController } from "./controller/UserController";
import { VoterController } from "./controller/VoterController";
import { Yc_imagesController } from "./controller/Yc_imagesController";
import { YchtblController } from "./controller/YchtblController";
import { PrintContorller } from "./controller/print_Controller";

export const Routes = [
  {
    method: "get",
    route: "/api/users",
    controller: UserController,
    action: "all",
  },
  {
    method: "get",
    route: "/api/users/:id",
    controller: UserController,
    action: "one",
  },
  {
    method: "post",
    route: "/api/users/signup",
    controller: UserController,
    action: "save",
  },
  {
    method: "post",
    route: "/api/users/login",
    controller: UserController,
    action: "login",
  },
  {
    method: "post",
    route: "/api/users/logout",
    controller: UserController,
    action: "logout",
  },
  {
    method: "delete",
    route: "/api/users/:id",
    controller: UserController,
    action: "remove",
  },

  /// voter routers
  {
    method: "get",
    route: "/api/voter",
    controller: VoterController,
    action: "all",
  },
  {
    method: "get",
    route: "/api/voter/pagination",
    controller: VoterController,
    action: "pagination",
  },
  {
    method: "get",
    route: "/api/voter/search",
    controller: VoterController,
    action: "search",
  },

  {
    method: "post",
    route: "/api/voter",
    controller: VoterController,
    action: "save",
  },
  {
    method: "delete",
    route: "/api/voter/:id",
    controller: VoterController,
    action: "remove",
  },

  //photo
  {
    method: "get",
    route: "/api/photo/search",
    controller: IdPicAndSignitureController,
    action: "search",
  },
  {
    method: "post",
    route: "/api/photo/save",
    controller: IdPicAndSignitureController,
    action: "save",
  },
  {
    method: "post",
    route: "/api/photo/save/profile",
    controller: IdPicAndSignitureController,
    action: "profile_save",
  },
  {
    method: "post",
    route: "/api/photo/save/signature",
    controller: IdPicAndSignitureController,
    action: "signature_save",
  },

  //yc print
  {
    method: "get",
    route: "/api/ychtbl/search",
    controller: YchtblController,
    action: "search",
  },
  {
    method: "get",
    route: "/api/ychtbl/all",
    controller: YchtblController,
    action: "all",
  },
  {
    method: "get",
    route: "/api/yc_img/search",
    controller: Yc_imagesController,
    action: "search",
  },

  {
    method: "get",
    route: "/api/print",
    controller: PrintContorller,
    action: "combinedSearch",
  },

  //yc tbl
  {
    method: "post",
    route: "/api/ychtbl",
    controller: YchtblController,
    action: "create",
  },
  //yc_images
  {
    method: "post",
    route: "/api/yc_img",
    controller: Yc_imagesController,
    action: "create",
  }
];
