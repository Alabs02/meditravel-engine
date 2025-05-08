import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Patch,
  UseGuards,
  Query
} from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { ClinicService } from "@clinic/services/clinic.service";
import { FirebaseAuthGuard, RolesGuard } from "@/core/guards";
import { Roles, CurrentUser } from "@/core/decorators";
import { UserDocument } from "@/modules/user/entities/user.entity";
import { CreateClinicDto, UpdateClinicDto } from "@clinic/dto/clinic.dto";
import { ResponseService } from "@/shared/response/response.service";

@Controller("clinics")
export class ClinicController {
  constructor(
    private readonly clinicService: ClinicService,
    private readonly response: ResponseService
  ) {}

  @Get("all")
  async getAll() {
    const data = await this.clinicService.findAll();
    return this.response.success({ data, message: "All clinics retrieved" });
  }

  @Get()
  @ApiQuery({ name: "page", required: true })
  @ApiQuery({ name: "limit", required: true })
  @ApiQuery({ name: "search", required: false })
  @ApiQuery({ name: "location", required: false })
  @ApiQuery({ name: "procedure", required: false })
  @ApiQuery({ name: "minPrice", required: false })
  @ApiQuery({ name: "maxPrice", required: false })
  async getFiltered(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("search") search?: string,
    @Query("location") location?: string,
    @Query("procedure") procedure?: string,
    @Query("minPrice") minPrice?: number,
    @Query("maxPrice") maxPrice?: number
  ) {
    const data = await this.clinicService.getPaginatedAndFiltered({
      page: Number(page),
      limit: Number(limit),
      search,
      location,
      procedure,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined
    });

    return this.response.success({
      data,
      message: "Filtered clinics retrieved"
    });
  }

  @Get(":id")
  async getOne(@Param("id") id: string) {
    const data = await this.clinicService.findById(id);
    return this.response.success({ data, message: "Clinic found" });
  }

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async create(@Body() dto: CreateClinicDto) {
    const data = await this.clinicService.create(dto);
    return this.response.success({ data, message: "Clinic created" });
  }

  @UseGuards(FirebaseAuthGuard)
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateClinicDto,
    @CurrentUser() user: UserDocument
  ) {
    const data = await this.clinicService.updateWithAccessControl(
      id,
      dto,
      user
    );
    return this.response.success({ data, message: "Clinic updated" });
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete(":id")
  async delete(@Param("id") id: string, @CurrentUser() user: UserDocument) {
    const data = await this.clinicService.deleteWithAccessControl(id, user);
    return this.response.success({ data, message: "Clinic deleted" });
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles("admin")
  @Patch(":id/restore")
  async restore(@Param("id") id: string) {
    await this.clinicService.restore(id);
    return this.response.success({ data: null, message: "Clinic restored" });
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles("admin")
  @Patch(":id/verify")
  async verify(@Param("id") id: string) {
    const data = await this.clinicService.verify(id);
    return this.response.success({ data, message: "Clinic verified" });
  }
}
